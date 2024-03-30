export default function AboutPage() {
  return (
    <section>
      <title>关于我们 | PromptRun</title>
      <div className="mt-5 px-4 mx-auto max-w-screen-xl text-center z-10 relative">
        <div className="container mx-auto px-4">
          <div className=" bg-gray-800 border border-gray-700 rounded-lg p-8 md:p-12 mb-8">
            <h1 className="mb-10 text-3xl font-extrabold tracking-tight leading-none md:text-4xl lg:text-5xl text-white">
              欢迎来到 Prompt<span className="text-primary">Run</span>
            </h1>
            <p className="mb-3 text-medium font-normal lg:text-lg sm:px-14 lg:px-42 text-gray-200">
              我们是一个AIGC（Artificial Intelligence Generated Content）提示词交易平台。在这里，你可以买入
              和售出优质的提示词，为你的创作、写作和其他AI生成内容的任务提供灵感和指导。
            </p>
            <p className="text-medium font-normal lg:text-lg sm:px-14 lg:px-42 text-gray-200">
              无论你是想寻找灵感、提高写作效率，还是想将自己的优质提示词与他人共享并获得收益，PromptRun
              都是你的理想选择。加入我们的平台，开始探索和发现无限的创作可能性！
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-start  bg-gray-800 border border-gray-700 rounded-lg p-8 md:p-12">
              <span className="cursor-pointer  text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-700 text-purple-400 mb-2">
                使命和愿景
              </span>
              <h2 className=" text-white text-3xl font-extrabold mb-3">PromptRun 使命</h2>
              <p className="text-lg font-normal  text-gray-400 mb-4">
                我们的使命是为用户提供一个可靠和创新的平台，让创作者、写作者和AI开发者能够轻松访问和共享高质量的提示词。
                我们相信，优秀的提示词可以激发创造力、提高效率，并帮助你在各种领域实现卓越的成果。
              </p>
            </div>
            <div className="text-start bg-gray-800 border border-gray-700 rounded-lg p-8 md:p-12">
              <span className="cursor-pointer  text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-700 text-green-400 mb-2">
                特点和优势
              </span>
              <h2 className="text-white text-3xl font-extrabold mb-3">PromptRun 优势</h2>
              <ul className="list-disc list-inside text-lg font-normal text-gray-400">
                <li>全面的提示词库，涵盖各种领域和主题</li>
                <li>高质量和验证的提示词，确保准确性和效果</li>
                <li>用户友好的交易平台，轻松买入和售出提示词</li>
                <li>活跃的平台，与其他创作者和 AI 开发者分享经验和合作</li>
                <li>持续的平台改进和更新，以满足用户需求</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-b to-transparent from-blue-950/30 w-full h-full absolute top-0 left-0 z-0"></div>
    </section>
  );
}
