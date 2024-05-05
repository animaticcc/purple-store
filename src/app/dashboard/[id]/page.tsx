'use client'
import Breadcrumb from '@/components/breadcrumb'
import Link from 'next/link'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function EditProduct() {
  const { id } = useParams()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')

  const [category, setCategory] = useState('')
  const [sizes, setSizes] = useState<any[]>([])
  const [colors, setColors] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/product?id=${id}`).then((res) => {
      res.json().then((product) => {
        setName(product.name)
        setDescription(product.description)
        setPrice(product.price)
        setImage(product.image)

        setCategory(product.category)
        setSizes(product.sizes)
        setColors(product.colors)
      })
    })
  }, [])

  async function handleFileChange(ev: any) {
    const files = ev.target.files
    if (files.length === 1) {
      const data = new FormData()
      data.set('file', files[0])

      const uploadingPromise = new Promise<void>((resolve, reject) => {
        fetch('/api/upload', {
          method: 'POST',
          body: data,
        }).then((response) => {
          if (response.ok) {
            response.json().then((link) => {
              setImage(link)
              resolve()
            })
          } else {
            reject()
          }
        })
      })

      await toast.promise(uploadingPromise, {
        loading: 'Uploading',
        success: 'Upload complete',
        error: 'Upload error',
      })
    }
  }

  async function handleFormSubmit(ev: any) {
    ev.preventDefault()

    const productPromise = new Promise<void>(async (resolve, reject) => {
      const response = await fetch('/api/product', {
        method: 'PUT',
        body: JSON.stringify({
          name,
          description,
          price,
          image,
          category,
          sizes,
          colors,
          _id: id,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) resolve()
      else reject()
    })

    await toast.promise(productPromise, {
      loading: 'Product saving',
      success: 'Product saved',
      error: 'Product saving error',
    })
  }

  async function handleDelete() {
    const deletePromise = new Promise<void>(async (resolve, reject) => {
      const response = await fetch(`/api/product?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) resolve()
      else reject()
    })

    await toast.promise(deletePromise, {
      loading: 'Product deleting',
      success: 'Product deleted',
      error: 'Product deleting error',
    })
  }

  return (
    <div className='mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-18 lg:px-8'>
      <Breadcrumb
        pages={[
          { name: 'Dashboard', href: '/dashboard' },
          { name, href: usePathname() },
        ]}
      />
      <form method='PUT' onSubmit={handleFormSubmit}>
        <div className='pb-6 border-b border-gray-200'>
          <div className='mt-6'>
            <label
              htmlFor='product-name'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Name
            </label>
            <div className='mt-2'>
              <input
                type='text'
                name='product-name'
                id='product-name'
                autoComplete='product-name'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />
            </div>
          </div>
          <div className='mt-6'>
            <label
              htmlFor='product-description'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Description
            </label>
            <div className='mt-2'>
              <textarea
                id='product-description'
                name='product-description'
                rows={3}
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
                value={description}
                onChange={(ev) => setDescription(ev.target.value)}
              />
            </div>
          </div>
          <div className='mt-6'>
            <label
              htmlFor='product-price'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Price
            </label>
            <div className='relative mt-2 rounded-md shadow-sm'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <span className='text-gray-500 sm:text-sm'>$</span>
              </div>
              <input
                type='text'
                name='product-price'
                id='product-price'
                className='block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                placeholder='0.00'
                aria-describedby='price-currency'
                value={price}
                onChange={(ev) => setPrice(ev.target.value)}
              />
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                <span className='text-gray-500 sm:text-sm' id='price-currency'>
                  USD
                </span>
              </div>
            </div>
          </div>
          <div className='mt-6'>
            <label
              htmlFor='product-category'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Category
            </label>
            <div className='mt-2'>
              <input
                type='text'
                name='product-category'
                id='product-category'
                autoComplete='product-category'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                value={category}
                onChange={(ev) => setCategory(ev.target.value)}
              />
            </div>
          </div>
          <div className='mt-6'>
            <label
              htmlFor='cover-photo'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Image
            </label>
            <div className='relative mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
              {image === '' ? (
                <div className='text-center'>
                  <PhotoIcon
                    className='mx-auto h-12 w-12 text-gray-300'
                    aria-hidden='true'
                  />
                  <div className='mt-4 flex text-sm leading-6 text-gray-600'>
                    <label
                      htmlFor='file-upload'
                      className='relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500'
                    >
                      <span>Upload a file</span>
                      <input
                        id='file-upload'
                        name='file-upload'
                        type='file'
                        className='sr-only'
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className='pl-1'>or drag and drop</p>
                  </div>
                  <p className='text-xs leading-5 text-gray-600'>
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              ) : (
                <>
                  <img src={image} alt='' className='h-48' />
                  <div className='absolute right-0 top-0 hidden pr-4 pt-4 sm:block'>
                    <button
                      type='button'
                      className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                      onClick={() => setImage('')}
                    >
                      <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <fieldset className='mt-6'>
            <legend className='text-sm font-semibold leading-6 text-gray-900'>
              Sizes
            </legend>
            <div className='mt-4 space-y-4'>
              {sizes.map((size, i) => (
                <div className='relative flex gap-x-3' key={size.name}>
                  <div className='flex h-6 items-center'>
                    <input
                      id={size.name}
                      name={size.name}
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                      checked={size.inStock}
                      onChange={(ev) =>
                        setSizes(
                          [...sizes].map((size, j) => ({
                            ...size,
                            inStock: j === i ? ev.target.checked : size.inStock,
                          }))
                        )
                      }
                    />
                  </div>
                  <div className='text-sm leading-6'>
                    <label
                      htmlFor={size.name}
                      className='font-medium text-gray-900'
                    >
                      {size.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
          <fieldset className='mt-6'>
            <legend className='text-sm font-semibold leading-6 text-gray-900'>
              Colors
            </legend>
            <div className='mt-4 space-y-4'>
              {colors.map((color, i) => (
                <div className='relative flex gap-x-3' key={color.name}>
                  <div className='flex h-6 items-center'>
                    <input
                      id={color.name}
                      name={color.name}
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                      checked={color.inStock}
                      onChange={(ev) =>
                        setColors((oldColors) => {
                          const newColors = [...oldColors]
                          newColors[i]['inStock'] = ev.target.checked
                          return newColors
                        })
                      }
                    />
                  </div>
                  <div className='text-sm leading-6'>
                    <label
                      htmlFor={color.name}
                      className='font-medium text-gray-900'
                    >
                      {color.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
        <div className='mt-6 flex items-center justify-between'>
          <Link
            href='/dashboard'
            className='rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500'
            onClick={handleDelete}
          >
            Delete
          </Link>
          <div className='flex items-center gap-x-6'>
            <Link
              href='/dashboard'
              className='text-sm font-semibold leading-6 text-gray-900'
            >
              Cancel
            </Link>
            <button
              type='submit'
              className='rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
