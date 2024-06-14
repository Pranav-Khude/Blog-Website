const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{

        const tookenCookieValue = req.cookies[cookieName];
        if(!tookenCookieValue){
            return next();
        }
        try {
            const userPayload=validateToken(tookenCookieValue);
            req.user=userPayload;
        } catch (error) {
        }
        return next();
    }
}

module.exports={
    checkForAuthenticationCookie
}