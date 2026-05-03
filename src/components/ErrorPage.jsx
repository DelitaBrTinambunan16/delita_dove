export default function ErrorPage({ code, description, image }) {
    return (
        <div className="text-center p-10">
            
            <h1 className="text-6xl font-bold text-pink-500">
                {code}
            </h1>

            <p className="text-gray-500 mt-2">
                {description}
            </p>

            <img
                src={image}
                alt="error"
                className="w-60 mx-auto mt-6"
            />

        </div>
    )
}