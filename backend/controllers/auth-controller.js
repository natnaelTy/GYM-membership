

export const signup = async (req, res) => {

    const {first_name, last_name, email, password} = req.body;
     try{

        if(!first_name || !last_name || !email || !password){
            return res.status(400).json({success: false, message: "All fields are required"});
        }

     }catch(err){
        console.log(err);
     }
}