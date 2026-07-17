
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

const Navbar = () => {
    return (
        <div>


            <LoginLink>Sign in</LoginLink>

            <RegisterLink>Sign up</RegisterLink>
        </div>
    )
}

export default Navbar