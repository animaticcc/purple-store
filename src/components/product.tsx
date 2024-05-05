export default function Product({ product, href }: any) {
  return (
    <div className='group relative'>
      <div className='aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80'>
        <img
          src={product.image} //Src
          //alt={product.imageAlt}
          className='h-full w-full object-cover object-center lg:h-full lg:w-full'
        />
      </div>
      <div className='mt-4 text-center font-medium'>
        <h3 className='text-gray-700'>
          <a href={href + '/' + product._id}>
            <span aria-hidden='true' className='absolute inset-0' />
            {product.name}
          </a>
        </h3>
        {/* <p className="text-gray-500">{product.color}</p> */}
        <p className='text-gray-900 text-sm'>${product.price}</p>
      </div>
      {/* <div className="flex items-center justify-center space-x-3 mt-2">
        {product.availableColors.map((color) => (
          <span
            key={color.name}
            className="h-4 w-4 rounded-full border border-black border-opacity-10"
            style={{ backgroundColor: color.colorBg }}
          >
          </span>
        ))}
      </div> */}
    </div>
  )
}
