import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable()
export class InstagramService {

    constructor(private http: HttpClient) { }

    getUserByUsername(username) {
        return this.http.get(`https://www.instagram.com/${username}/?__a=1`)
            .pipe(map(res => res))
    }

    getUserById(
        userId,
        count = 50,
        after = '') {
        return this.http.get(`https://www.instagram.com/graphql/query/?query_id=17888483320059182&id=${userId}&first=${count}&after=${after}`)
            .pipe(map(res => res))
    }

    getStats(media, user, username, topCount = 9) {
        let days = Array(7).fill({
            dayPosts: 0,
            dayLikes: 0,
            dayComments: 0,
            avgDayLikes: 0,
            avgDayComments: 0,
        });
        let mediaArray = media,
            comments = 0,
            likes = 0,
            averageComments = 0,
            averageLikes = 0,
            count = 0;


        let mostLikedMedia = this.getTopLikedMedia(media, topCount),
            mostCommentedMedia = this.getTopCommentedMedia(media, topCount);

        for (let node of mediaArray) {
            const day = new Date(node.node.taken_at_timestamp * 1000).getDay();
            days[day] = Object.assign({}, days[day], {
                dayPosts: days[day].dayPosts + 1,
                dayComments: days[day].dayComments + node.node.edge_media_to_comment.count,
                dayLikes: days[day].dayLikes + node.node.edge_media_preview_like.count,
            });
            likes += node.node.edge_media_preview_like.count;
            comments += node.node.edge_media_to_comment.count;
            count++;
        }

        let dayStats = days.map(day => Object.assign({}, day, {
            avgDayLikes: Math.round(day.dayLikes / day.dayPosts || 0),
            avgDayComments: Math.round(day.dayComments / day.dayPosts || 0)
        }))
        averageLikes = (likes / count) || 0;
        averageComments = (comments / count) || 0;

        return {
            username: username,
            name: user.full_name,
            id: user.id,
            bio: user.biography,
            website: user.external_url,
            profilePictureUrl: user.profile_pic_url,
            profilePictureUrlHD: user.profile_pic_url_hd,
            followers: user.edge_followed_by.count,
            following: user.edge_follow.count,
            posts: user.edge_owner_to_timeline_media.count,
            totalLikes: likes,
            totalComments: comments,
            totalEngagements: (likes + comments),
            averageLikes: (Math.round(likes / count)) || 0,
            averageComments: (Math.round(comments / count)) || 0,
            averageEngagements: Math.round((likes + comments) / count),
            mostLikedMedia: mostLikedMedia,
            mostCommentedMedia: mostCommentedMedia,
            sampleSize: count,
            days: dayStats,
            success: true,
        }
    }

    getTopLikedMedia(media, topCount) {
        return media.sort(function (node1, node2) {
            var x = node1.node.edge_media_preview_like.count
            var y = node2.node.edge_media_preview_like.count
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }).slice(0, (topCount > media.length ? media.length : topCount))
    }

    getTopCommentedMedia(media, topCount) {
        return media.sort(function (node1, node2) {
            var x = node1.node.edge_media_to_comment.count
            var y = node2.node.edge_media_to_comment.count
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }).slice(0, (topCount > media.length ? media.length : topCount));
    }


}
