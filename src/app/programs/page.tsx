"use client";

import { useState } from "react";
import { GenericLayout } from "@/components/GenericLayout";
import { ProgramAccordion } from "@/components/Programs/ProgramAccordion";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"tracks" | "focus-pathways">("tracks");

  return (
    <GenericLayout title="Programs">
      <div className="w-full flex flex-col items-center space-y-12 text-brown max-w-6xl mx-auto px-4">
        {/* Hero Description */}
        <div className="text-center max-w-4xl mt-8 md:mt-0">
          <p className="text-base sm:text-lg leading-relaxed">
            Just like baking with Churro, hackathons are all about mixing together the right ingredients — creativity, collaboration, and
            curiosity — to make something wonderful! At Pearl Hacks, our <span className="font-bold">Tracks</span> and <span className="font-bold">Focus Pathways</span> are designed to help you
            explore, learn, and create your own recipe for success.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-full overflow-hidden border-2 border-brown-light shadow-md max-w-md">
          <button
            onClick={() => setActiveTab("tracks")}
            className={`px-6 py-2 text-base font-semibold transition-all duration-300 ${
              activeTab === "tracks"
                ? "bg-white text-brown"
                : "bg-brown-light text-white hover:bg-brown-lighter"
            }`}
          >
            Tracks
          </button>
          <button
            onClick={() => setActiveTab("focus-pathways")}
            className={`px-6 py-2 text-base font-semibold transition-all duration-300 ${
              activeTab === "focus-pathways"
                ? "bg-white text-brown"
                : "bg-brown-light text-white hover:bg-brown-lighter"
            }`}
          >
            Focus Pathways
          </button>
        </div>

        {/* Content Area */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {activeTab === "tracks" && (
              <motion.div
                key="tracks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-8"
              >
              {/* Tracks Header */}
              <div className="text-center">
                <h2 className="font-sans font-bold text-2xl text-pink mb-4">Tracks</h2>
                <p className="text-base sm:text-lg max-w-3xl mx-auto">
                  Think of Tracks as the main layers of your hackathon experience — where your project can rise to the
                  occasion and compete for prizes. Whether you&apos;re diving in as a first-time hacker through our Beginner
                  Track or taking full creative freedom in our General Track, these categories are where you can submit your
                  projects for official judging and prizes.
                </p>
              </div>

              {/* Track Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 items-start">
                {/* General Track Card */}
                <div className="bg-white rounded-3xl border-4 border-brown-light p-5 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                    <div className="bg-brown-light rounded-full p-3 flex-shrink-0">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-sans text-xl sm:text-2xl font-bold text-brown break-words">General Track</h3>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg text-brown leading-relaxed">
                    The General Track is for all hackers — from seasoned coders to
                    first-time builders — ready to cook up something creative! In this
                    open-ended track, you can bring any idea to life using software,
                    hardware, design, or a mix of all three. You&apos;ll collaborate with
                    hackers of all backgrounds and interests to whip up something
                    uniquely yours.
                  </p>
                  <ProgramAccordion>
                    <ul className="list-disc pl-5 space-y-2">
                      <li className="pl-2">Everyone is automatically entered into the General Track.</li>
                      <li className="pl-2">You can also submit your project to sponsor challenges.</li>
                      <li className="pl-2">Eligible for standard Pearl Hacks prizes (1st, 2nd, and 3rd place).</li>
                    </ul>
                  </ProgramAccordion>
                </div>

                {/* Beginner Track Card */}
                <div className="bg-white rounded-3xl border-4 border-brown-light p-5 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                    <div className="bg-brown-light rounded-full p-3 flex-shrink-0">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-sans text-xl sm:text-2xl font-bold text-brown break-words">Beginner Track</h3>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg text-brown leading-relaxed">
                    New to hackathons or computer science? The Beginner Track is
                    your perfect starter recipe! You&apos;ll get access to beginner-friendly
                    workshops, learning resources, and mentorship to help you build
                    confidence, pick up new technical &apos;ingredients,&apos; and explore how
                    computing connects with your passions — from art to biology
                    and everything in between.
                  </p>
                  <ProgramAccordion>
                    <ul className="list-disc pl-5 space-y-2">
                      <li className="pl-2">Open to hackers who are new to hackathons and/or computer science.</li>
                      <li className="pl-2">You can still enter sponsor challenges.</li>
                      <li className="pl-2">Eligible for the dedicated Beginner Track Prize.</li>
                      <li className="pl-2">While eligible for General Track prizes, Beginner Track participants will primarily be recognized within their track.</li>
                    </ul>
                  </ProgramAccordion>
                </div>
              </div>
              </motion.div>
            )}

            {activeTab === "focus-pathways" && (
              <motion.div
                key="focus-pathways"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-8"
              >
              {/* Focus Pathways Header */}
              <div className="text-center space-y-6">
                <h2 className="font-sans font-bold text-2xl text-pink mb-4">Focus Pathways</h2>
                <p className="text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
                  Our <span className="font-bold">Focus Pathways</span> are like flavor add-ins — they&apos;re here to inspire your creativity and help you explore
                  exciting new areas of tech! While these pathways don&apos;t have separate prizes, they provide specialized
                  workshops, resources, and mentorship to help you grow new skills and bring extra flair to your projects.
                  They&apos;re a chance to try out new &apos;ingredients&apos; and see how they blend into your unique creation.
                </p>
              </div>

              {/* Focus Pathway Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 items-start">
                {/* UX/UI Focus Pathway Card */}
                <div className="bg-white rounded-3xl border-4 border-blue-light p-5 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                    <div className="bg-blue-light rounded-full p-3 flex-shrink-0">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-sans text-xl sm:text-2xl font-bold text-brown break-words">UX/UI Focus Pathway</h3>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg text-brown leading-relaxed">
                    The UX/UI Focus Pathway is for hackers who love design,
                    creativity, and user experience — the frosting that makes every
                    project beautiful and usable! Through guided workshops and
                    hands-on sessions, you&apos;ll learn tools like Figma and explore web
                    design principles to create intuitive, polished, and meaningful
                    digital experiences.
                  </p>
                  <ProgramAccordion>
                    <ul className="list-disc pl-5 space-y-2">
                      <li className="pl-2">Open to all participants interested in UX/UI, no experience needed.</li>
                      <li className="pl-2">Attend exclusive UX/UI workshops to level up your design skills.</li>
                      <li className="pl-2">You can still enter sponsor challenges and are eligible for the General Track.</li>
                      <li className="pl-2">This pathway does not have its own prize — it&apos;s a space to learn, explore, and add a creative spark to your hack!</li>
                    </ul>
                  </ProgramAccordion>
                </div>

                {/* AI Focus Pathway Card */}
                <div className="bg-white rounded-3xl border-4 border-blue-light p-5 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                    <div className="bg-blue-light rounded-full p-3 flex-shrink-0">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 7H7v6h6V7z" />
                        <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-sans text-xl sm:text-2xl font-bold text-brown break-words">AI Focus Pathway</h3>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg text-brown leading-relaxed">
                    The AI Focus Pathway invites hackers to stir in a little innovation
                    using artificial intelligence and machine learning! Experiment
                    with tools like chatbots, computer vision, or natural language
                    processing, and learn how AI can make your project smarter.
                    You&apos;ll get the chance to explore AI responsibly and creatively
                    through dedicated workshops and mentorship.
                  </p>
                  <ProgramAccordion>
                    <ul className="list-disc pl-5 space-y-2">
                      <li className="pl-2">Projects must feature AI or machine learning as a core component (e.g., training or fine-tuning a model, integrating an API, or building an AI-driven feature).</li>
                      <li className="pl-2">AI tools can assist your project, but shouldn&apos;t do all the &apos;baking&apos; for you — the creativity is still yours!</li>
                      <li className="pl-2">You can still enter sponsor challenges and are eligible for the General Track.</li>
                      <li className="pl-2">This pathway does not have its own prize — it&apos;s a place to experiment and learn cutting-edge tech skills.</li>
                    </ul>
                  </ProgramAccordion>
                </div>
              </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Closing Message */}
          <div className="text-center mt-12">
            <p className="text-base sm:text-lg max-w-3xl mx-auto italic leading-relaxed text-brown">
              No matter which Track or Pathway you choose, each experience is a chance to learn something new,
              collaborate with others, and whip up a project that&apos;s uniquely yours. So grab your apron, gather your
              team, and get ready to bake up something beautiful at Pearl Hacks!
            </p>
          </div>
        </div>
      </div>
    </GenericLayout>
  );
}