'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function Profile() {
  const session = useSession()
  const status = session.status

  const [userName, setUserName] = useState('')
  const [image, setImage] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [address, setAddress] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/profile').then((response) => {
        response.json().then((data) => {
          setUserName(data.name)
          setImage(data.image)
          setPhone(data.phone)
          setCountry(data.country)
          setCity(data.city)
          setState(data.state)
          setPostalCode(data.postalCode)
          setAddress(data.address)
          setIsAdmin(data.admin)
        })
      })
    }
  }, [status])

  if (status === 'unauthenticated') {
    return redirect('/login')
  }

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

  async function handleProfileInfoUpdate(ev: any) {
    ev.preventDefault()
    const savingPromise = new Promise<void>(async (resolve, reject) => {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: userName,
          image,
          phone,
          country,
          city,
          state,
          postalCode,
          address,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) resolve()
      else reject()
    })

    await toast.promise(savingPromise, {
      loading: 'Saving',
      success: 'Saved',
      error: 'Saving error',
    })
  }

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 sm:pt-18 lg:px-8'>
      <form
        className='divide-y divide-gray-900/10'
        method='PUT'
        onSubmit={handleProfileInfoUpdate}
      >
        <div className='grid grid-cols-1 gap-x-8 gap-y-10 py-12 md:grid-cols-3'>
          <div>
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
              Profile
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>
          <div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2'>
            <div className='col-span-full'>
              <label
                htmlFor='photo'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Photo
              </label>
              <div className='mt-2 flex items-center gap-x-3'>
                {image !== '' && image != undefined ? (
                  <img
                    className='h-12 w-12 rounded-full ring-2 ring-gray-200'
                    src={image}
                    alt=''
                  />
                ) : (
                  <span className='inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100 ring-2 ring-gray-200'>
                    <svg
                      className='h-full w-full text-gray-300'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                    </svg>
                  </span>
                )}
                <label
                  htmlFor='file-upload'
                  className='rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 select-none hover:bg-gray-50'
                >
                  Change
                </label>
                <input
                  id='file-upload'
                  type='file'
                  className='hidden'
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className='sm:col-span-3'>
              <label
                htmlFor='first-name'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Name
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='first-name'
                  id='first-name'
                  autoComplete='given-name'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  value={userName}
                  onChange={(ev) => setUserName(ev.target.value)}
                />
              </div>
            </div>
            <div className='sm:col-span-3'>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Email address
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  type='email'
                  name='email'
                  autoComplete='email'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:text-gray-400 disabled:bg-gray-50'
                  value={session.data?.user?.email!}
                  disabled={true}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-x-8 gap-y-10 py-12 md:grid-cols-3'>
          <div>
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
              Personal Information
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Use a permanent address where you can receive mail.
            </p>
          </div>
          <div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2'>
            <div className='sm:col-span-3'>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Phone number
              </label>
              <div className='mt-2'>
                <input
                  id='phone'
                  type='tel'
                  name='phone'
                  autoComplete='phone'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:text-gray-400 disabled:bg-gray-50'
                  value={phone}
                  onChange={(ev) => setPhone(ev.target.value)}
                />
              </div>
            </div>
            <div className='sm:col-span-3'>
              <label
                htmlFor='country'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Country
              </label>
              <div className='mt-2'>
                <select
                  id='country'
                  name='country'
                  autoComplete='country-name'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6'
                  value={country}
                  onChange={(ev) => setCountry(ev.target.value)}
                >
                  <option value=''>Select country</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>
            <div className='sm:col-span-2 sm:col-start-1'>
              <label
                htmlFor='city'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                City
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='city'
                  id='city'
                  autoComplete='address-level2'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  value={city}
                  onChange={(ev) => setCity(ev.target.value)}
                />
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label
                htmlFor='region'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                State / Province
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='region'
                  id='region'
                  autoComplete='address-level1'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  value={state}
                  onChange={(ev) => setState(ev.target.value)}
                />
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label
                htmlFor='postal-code'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                ZIP / Postal code
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='postal-code'
                  id='postal-code'
                  autoComplete='postal-code'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  value={postalCode}
                  onChange={(ev) => setPostalCode(ev.target.value)}
                />
              </div>
            </div>
            <div className='col-span-full'>
              <label
                htmlFor='street-address'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Street address
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='street-address'
                  id='street-address'
                  autoComplete='street-address'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  value={address}
                  onChange={(ev) => setAddress(ev.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='pt-6 flex items-center justify-end gap-x-6'>
          <button
            type='button'
            className='text-sm font-semibold leading-6 text-gray-900'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
