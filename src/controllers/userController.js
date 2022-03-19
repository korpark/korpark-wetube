import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";



export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;

  const isHeroku = process.env.NODE_ENV === "production"

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? (isHeroku ? file.location : file.path) : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
    );
    req.session.user = updatedUser;
    return res.redirect("/");
  };
  
  export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
      req.flash("error", "Can't change password.");
      return res.redirect("/");
    }
    return res.render("change-password", { pageTitle: "Change Password" });
  };
  export const postChangePassword = async (req, res) => {
    const {
      session: {
        user: { _id },
      },
      body: { oldPassword, NewPassword, NewPasswordConfirmation },
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
      return res.status(400).render("change-password", {
        pageTitle: "Change Password",
        errorMessage: "The current password is incorrect",
      });
    }
    if (NewPassword !== NewPasswordConfirmation) {
      return res.status(400).render("change-password", {
        pageTitle: "Change Password",
        errorMessage: "The password does not match the confirmation",
      });
    }
    user.password = NewPassword;
    await user.save();
    req.flash("info", "Password updated");
    return res.redirect("logout");
  };
  
  export const seeUserProfile = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate({
      path: "videos",
      populate: {
        path: "owner",
        model: "User",
      },
    });
    if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found." });
  }
  return res.render("profile", {
    pageTitle: user.name,
    user,
  });
};
