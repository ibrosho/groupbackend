import jwt from "jsonwebtoken";


export const checkToken = async (req, res, next) => {
    try {
        // grab the token from  the incoming http-only cookies
        const token = req.cookies.token;

        //  if there is no token cookies, stop the request immediately
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        // verify the token and extract the user id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attach the decoded user payload to the request object (rq.user)
        req.user = { id: decoded.id };

        //  pass the controller to the next function(controller)
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }

    }