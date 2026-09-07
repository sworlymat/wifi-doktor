import Home from "./Home";
export default async function Page({searchParams}:{searchParams:Promise<{checkout?:string}>}) {
  const {checkout} = await searchParams;
  return <Home checkout={checkout}/>;
}
