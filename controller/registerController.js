import express from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';


/**
 * Below is the function for performing user registration with all the mendatory inputs
and it hashes the user entered password then save it in the database.
 */

const saltRounds = 10;

export const registerController = (request, response) => {
  bcrypt.hash(request.body.password, saltRounds) 
  .then((hashedPassword) => {
    const user = new User({
      email: request.body.email,
      password: hashedPassword,
    });

    user.save()
    .then((result) => {
      response.status(201).send({
        message: "User created successfully",
        result
      });
    })
    .catch((error) => {
        response.status(500).send({
            message: "Something went wrong, User could not be created!"
        })
    })
  })
  .catch((e) => {
    response.status(500).send({
      message: "Something went wrong, Password was not hashed!",
      e
    })
  })
};


/**
 * Below is the function for performing user login with all the authenticated credentials
and prompts user if something is missing or wrong.
 * 
 */

export const loginController = (request, response) => {
  User.findOne( { email: request.body.email })
  // if email exists
  .then((user) => {
    // compare the password entered by the user with the password saved in db for that user.
    bcrypt.compare(request.body.password, user.password)
    .then((passwordCheck) => {
      // check if the password matches.
      if (!passwordCheck) {
        return response.status(400).send({
          message: "Password doesn't match",
          error
        })
      }

      // Create JWT token 
      const token = jwt.sign({
        userId: user._id,
        userEmail: user.email,
      },
      "RANDOM-TOKEN",
      { expiresIn: "24h"}
      );
      //return success response
      response.status(200).send({
        message: "Login successfull",
        email: user.email,
        token
      })
    })

    // catch error if password doest not match.
    .catch((error) => {
      response.status(400).send({
        message: "Password doesn't match",
        error
      })
    })
  })
  .catch((e) => {
    response.status(404).send({
      message: "Email is not valid",
      e
    })
  })
}