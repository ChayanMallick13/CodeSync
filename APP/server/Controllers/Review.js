const Reviews = require("../Models/Reviews");
const User = require("../Models/User");




exports.AddReview = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const reqUser = await User.findById(userId);
    const {rating,review} = req.body;

    if(!userId || !review || !reqUser){
        return res.status(404).json({
          success: false,
          message: "User Not Found"
        });
    }

    //check if previous review exists
    const prevReview = await Reviews.findOne(
        {
            user:userId,
        }
    );

    if(prevReview){
        const updatedReview = await Reviews.findByIdAndUpdate(prevReview._id,
            {
                review,
                rating,
            },
            {
                new:true,
            }
        )
    }
    else{
        const newReview = await Reviews.create(
            {
                user:userId,
                review:review,
                rating,
            }
        );
    }

    return res.status(200).json({
      success: true,
      message: "Review Added Successfully",
      review,
      rating,
    });

  } catch (error) {
    console.error(error);
    console.log('Some Internal Problem in AddReview');
    return res.status(500).json({
      success: false,
      message: 'Some Internal Problem in Adding Review'
    });
  }
};

exports.getUserReview = async (req, res) => {
  try {
    const user = req.user;
    const reqUser = await User.findById(user._id);
    if(!reqUser){
        return res.status(404).json({
          success: false,
          message: "User Not Found",
        });
    }
    const reviews = await Reviews.findOne(
        {
            user:reqUser._id,
        }
    );

    let review = '';
    let rating = 0;

    if(reviews){
        review = reviews.review || '';
        rating = reviews.rating || 0;
    }

    return res.status(200).json({
      success: true,
      message: "Review Fetched Successfully",
      rating,
      review,
    });

  } catch (error) {
    console.error(error);
    console.log('Some Internal Problem in getUserReview');
    return res.status(500).json({
      success: false,
      message: 'Some Internal Problem in getting User Review'
    });
  }
};

exports.getAllReviews = async (req, res) => {
  try {

    const allReviews = await Reviews.find()
    .sort(
        {
            rating:-1,
        }
    );

    return res.status(200).json({
      success: true,
      message: "All Reviews Got Successfully",
      allReviews,
    });

  } catch (error) {
    console.error(error);
    console.log('Some Internal Problem in getAllReviews');
    return res.status(500).json({
      success: false,
      message: 'Some Internal Problem in getting All Reviews'
    });
  }
};