export enum FriendshipStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

export type FriendUser = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  photoUrl: string | null;
  headline: string | null;
};

export type Friendship = {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
  requester: FriendUser;
  addressee: FriendUser;
};

export type SendFriendRequestInput = {
  addresseeId: string;
};
