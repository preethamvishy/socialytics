import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';


@Injectable()
export class InstagramService {

  constructor(private http: HttpClient) { }

  getUserByUsername(username) {
    return this.http.get(`https://www.instagram.com/${username}/?__a=1`)
      .map(res => res)
  }

  getUserById(
    userId,
    count = 50,
    after = '') {
    return this.http.get(`https://www.instagram.com/graphql/query/?query_id=17888483320059182&id=${userId}&first=${count}&after=${after}`)
      .map(res => res)
  }

  getStats (media, user, username, topCount = 6) {
    var mediaArray = media,
                    comments = 0,
                    likes = 0,
                    averageComments = 0,
                    averageLikes = 0,
                    count = 0,
                    likesArray = [],
                    commentsArray = [];

    var mostLikedMedia = this.getTopLikedMedia(media, topCount),
        mostCommentedMedia = this.getTopCommentedMedia(media, topCount);
    for (let node of mediaArray) {
        likes += node.node.edge_media_preview_like.count;
        comments += node.node.edge_media_to_comment.count;
        count++;
    }

    averageLikes = likes / count;
    averageComments = comments / count;

    return {
        username: username,
        name: user.full_name,
        id: user.id,
        bio: user.biography,
        website: user.external_url,
        profilePictureUrl: user.profile_pic_url,
        profilePictureUrlHD: user.profile_pic_url_hd,
        followers: user.followed_by.count,
        following: user.follows.count,
        posts: user.media.count,
        totalLikes: likes,
        totalComments: comments,
        totalEngagements: (likes + comments),
        averageLikes: (likes / count),
        averageComments: (comments / count),
        averageEngagements: ((likes + comments) / count),
        mostLikedMedia: mostLikedMedia,
        mostCommentedMedia: mostCommentedMedia,
        success: true,
        
    }
}

getTopLikedMedia (media, topCount) {
    return media.sort(function(node1, node2) {
        var x = node1.node.edge_media_preview_like.count
        var y = node2.node.edge_media_preview_like.count
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    }).slice(0, (topCount > media.length ? media.length : topCount))
 }
 
 getTopCommentedMedia (media, topCount) {
    return media.sort(function(node1, node2) {
        var x = node1.node.edge_media_to_comment.count
        var y = node2.node.edge_media_to_comment.count
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    }).slice(0, (topCount > media.length ? media.length : topCount));
 }
 
 
}
