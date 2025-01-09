import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { signIn } from "next-auth/react"

export const LoginCard = () => {
    return(
        <>
        <div className="w-full h-[92vh] overflow-hidden flex items-center justify-center">

        
        <Card className="max-w-lg -translate-y-10">
    <CardHeader>
    <CardTitle>Are you signed in?</CardTitle>
    <CardDescription>You need to be signed in to our website to create your own posts.</CardDescription>
    </CardHeader>
    <CardContent>
        <Button className="w-full" onClick={()=>signIn("google")}>
            Sign In
        </Button>
    </CardContent>

    </Card>
    </div>

        </>
    )
}