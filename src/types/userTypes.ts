export type UserSignUpBody = {
  username: string;
  password: string;
};

export type UserLoginBody = {
  username: string;
  password: string;
};

export type UserBooking = {
  rentPerDay: number;
  days: number;
  carName: string;
};
