import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(public http: Http) {

  }

  verifyToken(response) {
    if(localStorage.getItem("online") == "false"){
      return;
    }
    //VERIFY TOKEN
    return new Promise((resolve, reject) => 
      {
        this.http.get('https://api.instagram.com/v1/users/self/?access_token=' + response.access_token)
        .map(res => res.json())
        .subscribe(APIresponse => {  
          // console.log("verifyToken",APIresponse);
          resolve(APIresponse);
         },
         error => {
           reject(true);
         }
        )
      }
    );
  }

  getSelfMedia(response){
    if(localStorage.getItem("online") == "false"){
      return;
    }
    //GET SELF MEDIA LIKES
    return new Promise((resolve, reject) => {
      this.http.get('https://api.instagram.com/v1/users/self/media/recent/?count=999&access_token=' + response.access_token)
      .map(res => res.json())
      .subscribe(
        APIresponse => {  
        // console.log("getSelfMedia",APIresponse);
        resolve(APIresponse);
       },
      error =>{
        reject(true);
      })
    });
  }

  getSelfMediaLikes(response,mediaId){
    if(localStorage.getItem("online") == "false"){
      return;
    }
    //GET SELF MEDIA LIKES
    return new Promise((resolve, reject) => {
      this.http.get('https://api.instagram.com/v1/media/'+mediaId+'/likes?count=999&access_token=' + response.access_token)
      .map(res => res.json())
      .subscribe(
        APIresponse => {  
        // console.log("getSelfMediaLikes",APIresponse);
        resolve(APIresponse); 
      },
      error =>{
        reject(true);
      }
      )
    });
  }

  getNext(url){
    if(localStorage.getItem("online") == "false"){
      return;
    }
    //GET NEXT USERS
    return new Promise((resolve, reject) => {
      this.http.get(url)
      .map(res => res.json())
      .subscribe(
      APIresponse => {  
        resolve(APIresponse); 
      },
      error =>{
        reject(true)
      })
    });
  }
  
}
