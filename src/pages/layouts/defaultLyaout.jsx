import { Outlet } from "react-router-dom"
import { Header } from "../../components/app/header"

export default function DefaultLayout(){
  return(
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}