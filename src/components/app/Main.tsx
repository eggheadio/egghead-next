export default function Main({children}) {
  return (
    <main className="max-w-screen-lg w-full mx-auto sm:p-8 p-5 flex flex-col flex-grow prose">
      {children}
    </main>
  )
}
