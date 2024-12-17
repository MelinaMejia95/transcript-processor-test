"use client";

interface IErrorAlert {
  text: string;
}

function ErrorAlert ({ text }: IErrorAlert) {
  return (
    <div className="flex flex-col">
      <span className="text-xl text-[#eb5959] font-semibold">{text}</span>
      <span className="text-xl text-[#eb5959] font-semibold">Please try again later!</span>
    </div>
  )
}

export default ErrorAlert;
