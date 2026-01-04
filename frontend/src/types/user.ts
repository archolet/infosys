// Match backend GetFromAuthUserResponse / GetByIdUserResponse
export interface User {
  id: string; // GUID
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;
}

// For user list queries (if needed)
export interface UserListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;
}
