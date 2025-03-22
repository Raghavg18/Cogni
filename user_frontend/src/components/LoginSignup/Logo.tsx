import Image from "next/image"

const Logo = () => {
  return (
    <div className="flex gap-3 mb-4">
      <Image src="/login/logo.svg" alt="Logo" width={24} height={24}/>
      <h3 className="text-2xl font-bold ">Fiverr</h3>
    </div>
  )
}

export default Logo
