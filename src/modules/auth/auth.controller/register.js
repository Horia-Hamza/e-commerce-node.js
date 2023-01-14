import { userModel } from "../../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../services/sendEmail.js";
import { asyncHandler } from "../../../services/errorHandling.js";
import { nanoid } from "nanoid";

import {
  find,
  findById,
  findOne,
  findOneAndUpdateee,
  updateOne,
} from "../../../../DB/DBMethods.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  const user = await userModel.findOne({ email });
  // const user = await findOne(userModel, { email });
  console.log(user);
  if (user) {
    // res.status(200).json({ message: "email exist",user });
    next(new Error("email exist", { cause: 200 }));
  } else {
    const hash = bcrypt.hashSync(password, parseInt(process.env.saltRound));

    const newUser = new userModel({ userName, email, password: hash });
    console.log(newUser);

    const token = jwt.sign({ id: newUser._id }, process.env.emailToken, {
      expiresIn: 60 * 60 * 24,
    });
    const rftoken = jwt.sign({ id: newUser._id }, process.env.emailToken);
    const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
    const rflink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/rfToken/${rftoken}`;
    const message = `<a href="${link}">confirm your email please </a>
    <br>
    <a href="${rflink}">request new confirmation link </a>`;

    const subject = `confirm your email`;
    const emailResult = await sendEmail(newUser.email, subject, message);
    if (emailResult.accepted.length) {
      await newUser.save();
      res.status(201).json({ message: "done", id: newUser._id });
    } else {
      // res.status(400).json({ message: "please provide real email" });
      next(new Error("please provide real email", { cause: 400 }));
    }
  }
});
export const confirmEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.emailToken);
  if (!decoded?.id) {
    // res.status(400).send("invalid payload");
    next(new Error("invalid payload", { cause: 400 }));
  } else {
    // await userModel.updateOne(
    //   { _id: decoded.id, confirmEmail: false },
    //   { confirmEmail: true }
    // );
    await updateOne(
      userModel,
      { _id: decoded.id, confirmEmail: false },
      { confirmEmail: true }
    );
    // res.redirect(process.env.frontEndUrl);
    res.status(201).json({ message: "email confirmed" });
  }
});
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.emailToken);
  if (!decoded?.id) {
    next(new Error("invalid payload", { cause: 400 }));
  } else {
    const user = await findOne({
      model: userModel,
      conditions: { _id: decoded.id },
    });
    if (user?.confirmEmail === true) {
      next(new Error("email already confirmed", { cause: 200 }));
    } else {
      const token = jwt.sign({ id: user._id }, process.env.emailToken, {
        expiresIn: 60 * 2,
      });
      const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/rfToken/${token}`;

      const message = `<a href="${link}">follow me to confirm your account </a>`;

      const subject = `confirm your email`;
      const emailResult = await sendEmail(user.email, subject, message);
      if (emailResult.accepted.length) {
        await updateOne(
          userModel,
          { _id: decoded.id, confirmEmail: false },
          { confirmEmail: true }
        );
        await user.save();
        res.status(201).json({ message: "done", id: user._id });
      } else {
        next(new Error("please provide real email", { cause: 400 }));
      }
    }
  }
});
export const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // const user = await userModel.findOne({ email });
  const user = await findOne({ model: userModel,
     conditions: { email } });
  if (!user) {
    // res.status(404).json({ message: "email do not exist" });
    next(new Error("email do not exist", { cause: 404 }));
  } else {
    if (user.confirmEmail == false) {
      // res.status(400).json({ message: "confirm u email first" });
      next(new Error("confirm u email first", { cause: 400 }));
    } else {
      if (user.blocked == true) {
        // res.status(400).json({ message: "email blocked" });
        next(new Error("email blocked", { cause: 400 }));
      } else {
        const compare = bcrypt.compareSync(password, user.password);
        if (!compare) {
          // res.status(400).json({ message: "wrong pass" });
          next(new Error("wrong pass", { cause: 400 }));
        } else {
          const token = jwt.sign(
            { id: user._id, isLoggedIn: true },
            process.env.tokenSignature,
            { expiresIn: 60 * 60 * 24 }
          );
          res.status(200).json({ message: "Done", token });
        }
      }
    }
  }
});
export const requestCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await findOne({
    model: userModel,
    conditions: { email },
    select: "email isDeleted blocked",
  });
  if (!user) {
    next(Error("can not find user", { cause: 404 }));
  } else {
    if (user.isDeleted == true) {
      next(Error("user is deleted", { cause: 404 }));
    } else {
      if (user.bloked == true) {
        next(Error("user is deleted", { cause: 404 }));
      } else {
        const code = nanoid();
        await updateOne({
          model: userModel,
          conditions: { _id: user._id },
          data: { code },
        });
        sendEmail(
          user.email,
          "forgetPassword",
          `<h2>pleasw use this code${code}:to reset your pass</h2>`
        );
        res.status(200).json({ message: "done" });
      }
    }
  }
});

export const forgetPass = asyncHandler(async (req, res, next) => {
  const { email, code, password } = req.body;
  const user = await findOne({
    model: userModel,
    conditions: { email },
  });
  if (!user) {
    next(Error("not registerd account", { cause: 404 }));
  } else {
    if (user.isDeleted == true) {
      next(Error("user is deleted", { cause: 404 }));
    } else {
      if (user.bloked == true) {
        next(Error("user is bloked", { cause: 404 }));
      } else {
        if (user.code != code || code == null) {
          next(Error("in valid code", { cause: 403 }));
        } else {
          const hash = bcrypt.hashSync(
            password,
            parseInt(process.env.saltRound)
          );
          const newUser = await updateOne({
            model: userModel,
            conditions: { _id: user._id },
            data: { password: hash, code: null },
          });
          res.status(200).json({ message: "done", id: newUser._id });
        }
      }
    }
  }
});
