"use client"

import { Button } from "@/components/ui/button"

export function ContactForm() {
  return (
    <section className="py-24 bg-grey-08">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-16">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-grey-30"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-grey-30"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-grey-30"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Let&apos;s Make it Happen</h2>
          </div>
          <p className="text-grey-60 max-w-4xl">
            Ready to take the first step toward your dream property? Fill out the form below, and our real estate wizards will work their magic to find your perfect match. Don&apos;t wait; let&apos;s embark on this exciting journey together.
          </p>
        </div>

        <div className="bg-grey-10 border border-grey-15 p-12 rounded-2xl">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-3">
                <label className="text-white font-medium block">First Name</label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  className="w-full bg-grey-08 border border-grey-15 rounded-lg p-4 text-white placeholder:text-grey-40 focus:outline-none focus:ring-1 focus:ring-purple-60"
                />
              </div>
              <div className="space-y-3">
                <label className="text-white font-medium block">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  className="w-full bg-grey-08 border border-grey-15 rounded-lg p-4 text-white placeholder:text-grey-40 focus:outline-none focus:ring-1 focus:ring-purple-60"
                />
              </div>
              <div className="space-y-3">
                <label className="text-white font-medium block">Email</label>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="w-full bg-grey-08 border border-grey-15 rounded-lg p-4 text-white placeholder:text-grey-40 focus:outline-none focus:ring-1 focus:ring-purple-60"
                />
              </div>
              <div className="space-y-3">
                <label className="text-white font-medium block">Phone</label>
                <input
                  type="tel"
                  placeholder="Enter Phone Number"
                  className="w-full bg-grey-08 border border-grey-15 rounded-lg p-4 text-white placeholder:text-grey-40 focus:outline-none focus:ring-1 focus:ring-purple-60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-3">
                <label className="text-white font-medium block">Preferred Location</label>
                <select className="w-full bg-grey-08 border border-grey-15 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-60 appearance-none">
                  <option>Select Location</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-white font-medium block">Property Type</label>
                <select className="w-full bg-grey-08 border border-grey-15 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-60 appearance-none">
                  <option>Select Property Type</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-white font-medium block">No. of Bathrooms</label>
                <select className="w-full bg-grey-08 border border-grey-15 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-60 appearance-none">
                  <option>Select no. of Bathrooms</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-white font-medium block">No. of Bedrooms</label>
                <select className="w-full bg-grey-08 border border-grey-15 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-60 appearance-none">
                  <option>Select no. of Bedrooms</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-white font-medium block">Budget</label>
                <select className="w-full bg-grey-08 border border-grey-15 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-60 appearance-none">
                  <option>Select Budget</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-white font-medium block">Preferred Contact Method</label>
                <div className="flex gap-4">
                  <div className="flex-grow flex items-center justify-between bg-grey-08 border border-grey-15 rounded-lg p-4">
                    <input type="text" placeholder="Enter Your Number" className="bg-transparent border-none focus:outline-none text-white w-full" />
                    <input type="radio" name="contact" className="accent-purple-60 w-5 h-5" />
                  </div>
                  <div className="flex-grow flex items-center justify-between bg-grey-08 border border-grey-15 rounded-lg p-4">
                    <input type="email" placeholder="Enter Your Email" className="bg-transparent border-none focus:outline-none text-white w-full" />
                    <input type="radio" name="contact" className="accent-purple-60 w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-white font-medium block">Message</label>
              <textarea
                placeholder="Enter your Message here.."
                rows={5}
                className="w-full bg-grey-08 border border-grey-15 rounded-lg p-4 text-white placeholder:text-grey-40 focus:outline-none focus:ring-1 focus:ring-purple-60"
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 text-grey-60 text-sm">
                <input type="checkbox" className="accent-purple-60 w-4 h-4" />
                <span>I agree with <a href="#" className="underline">Terms of Use</a> and <a href="#" className="underline">Privacy Policy</a></span>
              </div>
              <Button className="bg-purple-60 hover:bg-purple-65 text-white h-16 px-12 text-lg rounded-xl w-full md:w-auto">
                Send Your Message
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
