import { v4 as uuidv4 } from 'uuid';

class BlogPost {
  constructor(title, postBody) {
    this.id = uuidv4();
    this.title = title;
    this.postBody = postBody;
    this.views = 0;
    this.created = new Date();
    this.lastEdited = null;
  }

  postViewed() {
    this.views++;
  }
}

export { BlogPost };