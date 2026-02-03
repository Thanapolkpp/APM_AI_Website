import React from "react"

const Footer = () => {
    return (
        <footer className="w-full bg-pink-100 border-t border-pink-100">
            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Top */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    {/* Brand */}
                    <div>
                        <h2 className="text-2xl font-extrabold text-pink-600">
                            🌸 APM AI
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Assistant for Personal Motivation 💖
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-4 text-sm font-medium">
                        <a
                            href="#"
                            className="text-gray-600 hover:text-pink-500 transition"
                        >
                            Contact us
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 hover:text-pink-500 transition"
                        >
                            About
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 hover:text-pink-500 transition"
                        >
                            Features
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 hover:text-pink-500 transition"
                        >
                            Support
                        </a>
                    </div>

                    {/* Report problem */}
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold text-gray-700">
                            พบปัญหาใช้งานใช่ไหม
                        </p>

                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSdj0wFFzJlCFEkaQeFHSrxsl2TpOLeE8frO8861AHRysxyRRg/viewform?usp=publish-editor"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white border border-pink-100 shadow-sm text-sm text-pink-600 hover:bg-pink-100 transition"
                        >
                            ร้องเรียน / แจ้งปัญหา
                        </a>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} APM AI — All rights reserved</p>

                    <p className="text-center">
                        Powered by{" "}
                        <span className="text-pink-500 font-semibold">
                            APM AI • Assistant for Personal Motivation
                        </span>
                    </p>

                </div>
            </div>

        </footer>
    )
}

export default Footer
