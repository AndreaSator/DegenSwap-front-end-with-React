import { useEffect } from "react"

export const Loader = (props) => {
    useEffect(() => {
        comingsoon()
    }, [])
    const comingsoon = () => {

        let btn = document.querySelector('.hero__content--form .connect-wallet button')
        // btn.onmouseenter = function () {

        //     btn.textContent = "Coming Soon"
        //     btn.parentElement.style.backgroundColor = "#fd0352"
        //     btn.style.color = "#fff"
        // }

        // btn.onmouseleave = function () {

        //     btn.textContent = "Connect Wallet"
        //     btn.parentElement.style.backgroundColor = "#000"

        // }
    }



    return (
        <div className="connectpopup">
            <div className="content">
                Connecting Your Wallet ...
                </div>
        </div>
    )
}