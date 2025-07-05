export default async function Page({ params }: { params: { req: string[] } }) {
  const timestamp = atob(params.req[0].toString());
  return (
    <div>
      
    </div>
  )
}
