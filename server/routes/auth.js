var express = require('express');
var router = express.Router();
var userModel = require('../schemas/user')
var responseHandle = require('../helpers/responseHandle');
var { validationResult } = require('express-validator');
var check = require('../validators/auth');
var bcrypt = require('bcrypt');
var sendMail = require('../helpers/sendmail')
var avatarInitials = require('avatar-initials');
var protect = require('../middlewares/protect');
const config = require('../configs/config');
const { generateAvatar, saveAvatarImage } = require('../validators/avatarGenerator');

router.get('/me', protect, async function (req, res, next) {
  let me = await userModel.findById(req.userId);
  responseHandle.renderResponse(res, true, me)
});


router.post('/register', check(), async function (req, res, next) {
  try {
      var result = validationResult(req);
      if (!result.isEmpty()) {
          return responseHandle.renderResponse(res, false, result.errors);
      }
      
      const initials = getInitials(req.body.username);

      var newUser = new userModel({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          role: ["USER"]
      });

      // Use the imported function directly
      newUser.avatar = saveAvatarImage(req.body.username, generateAvatar(initials));

      await newUser.save();
      responseHandle.renderResponse(res, true, newUser);
  } catch (error) {
      next(error);
  }
});

function getInitials(username) {
  const initialsArray = username.split(' ').map(word => word.charAt(0).toUpperCase());
  return initialsArray.join('');
}

router.post('/login', async function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    responseHandle.renderResponse(res, false, "nhap day du thong tin de dang nhap")
    return;
  }
  var user = await userModel.findOne({ username: req.body.username });
  if (!user) {
    responseHandle.renderResponse(res, false, "username hoac password khong dung");
    return;
  }

  if (user.banned) {
    if (user.banExpires) {
      if (new Date(user.banExpires) > new Date()) {
        const remainingTime = Math.ceil((new Date(user.banExpires) - Date.now()) / (1000 * 60 * 60));
        responseHandle.renderResponse(res, false, `Tài khoản của bạn đã bị cấm đến ${user.banExpires}. Vui lòng thử lại sau ${remainingTime} giờ.`);
        return;
      } else{
        user.banned = false;
        await user.save();
      }
    } else {
      responseHandle.renderResponse(res, false, "Tài khoản của bạn đã bị cấm vĩnh viễn.");
      return;
    }
  }

  var result = bcrypt.compareSync(req.body.password, user.password);
  let token = user.genJWT();
  if (result) {
    res.status(200).cookie(
      "token", token, {
      expires: new Date(Date.now() + config.COOKIE_EXP * 3600 * 1000),
      httpOnly: true
    }
    ).send({
      token: token,
      success: true,
      avatar: `http://localhost:3000/${user.avatar}`,
      _id: user._id 
    });
    //responseHandle.renderResponse(res, true, user.genJWT());
  } else {
    responseHandle.renderResponse(res, false, "username hoac password khong dung");
  }
});

router.post('/forgotpassword', async function (req, res, next) {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    responseHandle.renderResponse(res, false, "email khong ton tai");
    return;
  }
  let token = user.genRestPasswordToken();
  await user.save()
  let url = `http://127.0.0.1:5500/client/build/resetPassword.html?token=${token}`
  try {
    await sendMail(user.email, url);
    responseHandle.renderResponse(res, true, "email thanh cong");
  } catch (error) {
    user.ResetPasswordTokenExp = undefined;
    user.ResetPasswordToken = undefined;
    await user.save();
    responseHandle.renderResponse(res, false, error);
  }

});

router.post('/resetpassword/:token', async function (req, res, next) {
  let user = await userModel.findOne({ ResetPasswordToken: req.params.token });
  if (!user) {
    responseHandle.renderResponse(res, false, "URL khong hop le");
    return;
  }
  if (user.ResetPasswordTokenExp < Date.now()) {
    responseHandle.renderResponse(res, false, "URL qua han");
    return;
  }
  user.password = req.body.password;
  user.ResetPasswordTokenExp = undefined;
  user.ResetPasswordToken = undefined;
  await user.save()
  responseHandle.renderResponse(res, true, "doi pass thanh cong");
});


module.exports = router;






