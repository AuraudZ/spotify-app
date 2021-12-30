export interface IUser {
  id: string;
  display_name: string;
  email: string;
  country: string;
  images: any[];
  product: string;
  type: string;
  uri: string;
}
export interface IUserPlaylist {
  id: string;
  name: string;
  uri: string;

  images: string[];
  owner: IUser;
  tracks: any[];
}
