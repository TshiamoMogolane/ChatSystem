
export default function ForgotPassword() {

    return (
        <div>
            <div className="logo-wrapper text-center mr-8 mt-50">
                <img
                    src="../public/logo.png"           // put your logo image in the public folder
                    alt="Chat System Logo"
                    height="100"               // adjust size
                    className="text-right"
                />
            </div>

           <div className="auth-container" >
                <h4 className="text-left mb-2">Reset Password</h4>
                <form>
                    <input type="email" placeholder="Enter your email" required />
                    <button type="submit">Enter</button>
                </form>
            </div>

        </div>
    )

};