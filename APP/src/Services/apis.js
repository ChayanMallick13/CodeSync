const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export const authApis = {
    GOOGLE_SIGN_IN_API:BASE_URL+'/auth/google/verify',
    GITHUB_SIGN_IN_API:BASE_URL+'/auth/githubReq',
    LOGIN_API:BASE_URL+'/auth/signin',
    SIGN_UP_API:BASE_URL+'/auth/signup',
    SEND_OTP_API:BASE_URL+'/auth/sendOtp',
    FORGOT_PASSWORD_SEND_EMAIL_API:BASE_URL+'/auth/forgot-password/sendmail',
    FORGOT_PASSWORD_RESET_PASS:BASE_URL+'/auth/forgot-password/resetpasswordVerify',
}

export const profileLinks = {
    FETCH_PROFILE_DETAILS:BASE_URL+'/profile/getuserInfo',
    CHANGE_USER_IMAGE_API:BASE_URL+'/profile/changeProfilePicture',
    UPDATE_USERNAME_API:BASE_URL+'/profile/updateUsername',
    UPDATE_PASSWORD_API:BASE_URL+'/profile/updatePassword',
    GET_ALL_USER_REPOS_API:BASE_URL+'/profile/getAllUserRepos',
}

export const roomLinks = {
    CREATE_ROOM_FROM_REPO:BASE_URL+'/room/createroom-fromRepo',
    GET_ALL_USER_ROOMS:BASE_URL+'/room/getAllUserRooms',
    GET_ROOM_INFO:BASE_URL+'/room/getRoomInfo',
    GET_ITEM_INFO:BASE_URL+'/room/folder/getDetails',
    JOIN_A_ROOM_API:BASE_URL+'/room/joinRoom',
    GET_ALL_MESSAGES:BASE_URL+'/room/getAllMsgs',
    RENAME_A_FILE:BASE_URL+'/room/file/rename',
    RENAME_A_FOLDER:BASE_URL+'/room/folder/rename',
    RENAME_A_MEDIA:BASE_URL+'/room/media/rename',
    DELETE_A_FILE:BASE_URL+'/room/file/delete',
    DELETE_A_MEDIA:BASE_URL+'/room/media/delete',
    DELETE_A_FOLDER:BASE_URL+'/room/folder/delete',
    DELETE_A_ROOM:BASE_URL+'/room/delete',
    CREATE_A_ITEM:BASE_URL+'/room/createItem',
    CHANGE_USER_PERMISSIONS:BASE_URL+'/room/changePermissions',
    CRETE_A_ROOM:BASE_URL+'/room/createRoom',
}

export const ratingLinks = {
    CREATE_RATING_API:BASE_URL+'/profile/addReview',
    GET_ALL_REVIEWS:BASE_URL+'/profile/getAllReviews',
}