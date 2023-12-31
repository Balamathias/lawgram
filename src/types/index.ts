export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    profileImage: URL | string;
    file: File[];
  };
  
  export type INewPost = {
    userId: string;
    caption: string;
    file: File[] | [];
    location?: string;
    tags?: string;
  };
  
  export type INewComment = {
    user: string;
    post: string;
    comment: string;
    file: File[] | [];
    imageId?: string;
    imageUrl?: string;
  };
  
  export type IUpdateComment = {
    commentId: string | undefined,
    user?: string;
    post?: string;
    comment: string;
    file: File[] | [];
    imageId?: string;
    imageUrl?: string;
  };
  
  export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    profileImage: string;
    bio: string;
  };
  
  export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
  };
  
  export type IcontextType = {
    user: IUser,
    isLoading: boolean,
    isAuthenticated: boolean,
    setUser:  React.Dispatch<React.SetStateAction<IUser>>,
    setIsAuthenticated:  React.Dispatch<React.SetStateAction<boolean>>,
    checkUser: () => Promise<boolean>
  }