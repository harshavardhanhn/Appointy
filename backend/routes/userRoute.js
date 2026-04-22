import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, payment, verifyPayment } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';
import { validateRegister, validateLogin } from '../middlewares/validateUser.js';

const userRouter = express.Router();

userRouter.post("/register", validateRegister, registerUser)
userRouter.post("/login", validateLogin, loginUser)
userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)
userRouter.post("/payment", authUser, payment)
userRouter.post("/verify-payment", authUser, verifyPayment)


 




export default userRouter;