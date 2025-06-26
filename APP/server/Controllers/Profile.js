const User = require("../Models/User");
const bcrypt = require('bcrypt');
const isCloudinaryUrl = require("../Utilities/isCloudinaryUrl");
const { removeFileFromCloudinary } = require("../Utilities/FileRemover");
const { UploadFileToCloudinary } = require("../Utilities/FileUploader");
const Tokens = require("../Models/Tokens");
const providerTypes = require("../Data/providerTypes");
const apiConnector = require("../Utilities/apiConnector");


exports.getAllUserInfo = async(req,res) => {
    try {
        const {user} = req;

        if(!user){
            return res.status(404).json(
                {
                    succces:false,
                    user:null,
                }
            );
        }

        //return the response
        return res.status(200).json(
            {
                succces:true,
                user:user,
            }
        )
    } catch (error) {
        console.log('Some Error in User Info Extraction');
        console.error(error);
        return res.status(500).json(
            {
                succcess:false,
                user:null,
                message:"Some Server Error Occurred",
            }
        )
    }
}

exports.updateUserName = async(req,res) => {
    try {
        const {firstName,lastName} = req.body;
        const user = req.user;

        if(!firstName){
            return res.status(401).json(
                {
                    succces:false,
                    message:"Invalid Name Input",
                }
            );
        }

        const existingUser = await User.findById(user._id);

        if(!existingUser){
            return res.status(404).json(
                {
                    succces:false,
                    message:'User Not Found',
                }
            )
        }

        let updatedUser = await User.findByIdAndUpdate(existingUser._id,
            {
                firstName,
                lastName,
            },{
                new:true,
            }
        );

        updatedUser.password=null;

        return res.status(200).json(
            {
                succces:true,
                user:updatedUser,
                message:"User Details Updated Successfully",
            }
        )

    } catch (error) {
        console.log('Error in Updating user details');
        console.error(error);
        return res.status(500).json(
            {
                succces:false,
                message:"Some Server Error Occurred",
            }
        )
    }
}

exports.updatePassword = async(req,res) => {
    try {
        const {oldPassword,newPassword} = req.body;
        const user = req.user;

        console.log(user);

        if(!oldPassword || !newPassword){
            return res.status(401).json(
                {
                    succces:false,
                    message:"Invalid Requets",
                }
            )
        }

        const existingUser = await User.findById(user._id);

        const isPasswordMatch = await bcrypt.compare(oldPassword,existingUser.password);

        if(!isPasswordMatch){
            return res.status(401).json(
                {
                    succces:false,
                    message:"Old Password Do Not Match",
                }
            )
        }

        const newHashedPass = await bcrypt.hash(newPassword,10);

        const updatedUser = await User.findByIdAndUpdate(user._id,
            {
                password:newHashedPass,
            },{
                new:true,
            }
        );

        updatedUser.password=null;

        return res.status(200).json(
            {
                succces:true,
                user:updatedUser,
                message:"Password Updated Successfully",
            }
        )

    } catch (error) {
        console.error(error);
        console.log('Error in Changing Password');
        return res.status(500).json(
            {
                succces:false,
                message:"Some Server Error Occured",
            }
        )
    }
}

exports.changeProfilePicture = async(req,res) => {
    try {
        const user = req.user;
        
        
        const userExists = await User.findById(user._id);
        
        if(!userExists){
            return res.status(404).json(
                {
                    succces:false,
                    message:"Invalid User",
                }
            )
        }
        const previousImage = userExists.image;
        console.log('file',req.files);
        const newImage = req.files?.profilePicture;
        
        if(isCloudinaryUrl(previousImage)){
            await removeFileFromCloudinary(previousImage,'image');
        }
        
        const newPictureUploadDetails = await UploadFileToCloudinary(newImage,`${process.env.CLOUDINARY_USER_DP_FOLDER}`);

        //update the user details
        const updatedUser = await User.findByIdAndUpdate(userExists._id,
            {
                image:newPictureUploadDetails.secure_url,
            },{
                new:true,
            }
        );

        updatedUser.password=null;

        //user profile picture chnaged
        return res.status(200).json(
            {
                succces:true,
                user:updatedUser,
                message:"User Profile Picture updated Successfully",
            }
        );

    } catch (error) {
        console.error(error);
        console.log('Some Problem in CHnage Profile Picture Handler');
        return res.status(500).json(
            {
                succces:false,
                message:"Some Problem Occurred in Changing Profile Picture",
            }
        );
    }
}

exports.getUserAllRepos = async(req,res) => {
    try {
        const user = req.user;

        //find the user
        const reqUser = await User.findById(user._id);

        if(!reqUser){
            return res.status(404).json(
                {
                    succces:false,
                    message:"Some Problem Occurred, Invalid User",
                }
            )
        }

        //get the token 
        const tokenEntry = await Tokens.findOne(
            {
                provider:providerTypes.GITHUB,
                user:reqUser._id,
            }
        );

        if(!tokenEntry || !reqUser.accountType.includes(providerTypes.GITHUB)){
            return res.status(404).json(
                {
                    succces:false,
                    message:"user Github Accoun Not found",
                }
            )
        }

        //get the repos info
        let allRepoInfo = [];
        let page = 1;
        const perPage = 100;
        while(true){
            const responseRepo = await apiConnector('GET',
                process.env.GITHUB_ALLREPO_INFO,
                null,
                {
                    Authorization: `Bearer ${tokenEntry.token}`,
                    Accept: 'application/vnd.github+json',
                },
                {
                    per_page:perPage,
                    page:page,
                    visibility:'all',
                }
            );

            const repoInfo = responseRepo.data;
            allRepoInfo.push(...repoInfo);

            if(repoInfo.length<perPage){
                break;
            }
            else{
                page++;
            }
        }

        allRepoInfo = allRepoInfo.map(
            (repo) => {
                return {
                    id:repo.id,
                    name:repo.name,
                    full_name:repo.full_name,
                    private:repo.private,
                    description:repo.description,
                    url:repo.html_url,
                    owner:repo.owner.login,
                    branch:repo.default_repo,
                }
            }
        );

        //return the response 
        return res.status(200).json(
            {
                succces:true,
                message:"All Repos Fetched Successfully",
                allRepoInfo,
            }
        );

    } catch (error) {
        console.log('Some Problem In Getting Repos Info');
        console.error(error);
        return res.status(500).json(
            {
                succces:false,
                message:"Some Server Error in Getting Users Repos",
            }
        );
    }
}





// https://drive.google.com/file/d/1WTAJ6dxbjiP_qp_psagzHIGpKzhUh-nr/view?usp=drive_link