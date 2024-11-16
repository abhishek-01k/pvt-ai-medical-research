
import { MainNav } from "./main-nav"
import { ThemeToggle } from "./theme-toogle"
import { siteConfig } from "../../config/site"
import ConnectWallet from "./ConnectWallet"

export function SiteHeader() {
    return (
        <header className="bg-background sticky top-0 z-40 w-full border-b">
            <div className="container m-auto flex h-16 items-center">
                <MainNav items={siteConfig.mainNav} />
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-1">

                        <ConnectWallet />
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    )
}