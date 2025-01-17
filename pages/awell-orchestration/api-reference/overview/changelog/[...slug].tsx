import format from 'date-fns/format'
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { type MDXRemoteSerializeResult, MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { ParsedUrlQuery } from 'querystring'
import { ReactNode } from 'react'

import { DocsHeader } from '../../../../../src/components/Docs/atoms'
import { DocsLayout } from '../../../../../src/components/Layouts'
import { SEO } from '../../../../../src/components/SEO'
import { TOC } from '../../../../../src/components/TOC'
import { mdxComponents, mdxOptions } from '../../../../../src/config/mdx'
import { useTableOfContents } from '../../../../../src/hooks'
import {
  getAllOrchestrationReleasesChangelogs,
  getOrchestrationReleaseChangelog,
} from '../../../../../src/utils/content/awell-orchestration'

type ReleasePageProps = {
  frontMatter: {
    title: string
    description: string
    releaseDate: string
  }
  mdxSource: MDXRemoteSerializeResult
  slug: string
  content: string
}

export default function ReleasePage({
  frontMatter,
  mdxSource,
  slug,
  content,
}: ReleasePageProps) {
  const { toc } = useTableOfContents(content)

  return (
    <div>
      <SEO
        title={`Release ${frontMatter.title} changelog`}
        description={frontMatter.description}
        url={`/awell-orchestration/api-reference/changelog/${slug}`}
        canonicalUrl={`/awell-orchestration/api-reference/overview/changelog/${slug}`}
      />
      <DocsHeader
        heading="Changelog"
        title={`Release ${frontMatter.title}`}
        description={`Released on ${format(
          new Date(frontMatter.releaseDate),
          'MMMM d, y'
        )}`}
        githubUrl={`/content/awell-orchestration/changelog/${slug}.mdx`}
      />
      <div>
        <div id="content-wrapper">
          <MDXRemote {...mdxSource} components={mdxComponents} />
        </div>
        <div className="mt-12">
          <div className="text-base leading-6 text-slate-700 font-semibold flex items-center dark:text-slate-200">
            <Link href="/awell-orchestration/api-reference/overview/changelog">
              <a
                className="group flex items-center hover:text-slate-900 dark:hover:text-white"
                title="Back to overview"
                data-track-heap="quick-navigation-prev"
              >
                <svg
                  viewBox="0 0 3 6"
                  className="mr-3 w-auto h-1.5 text-slate-400 overflow-visible group-hover:text-slate-600 dark:group-hover:text-slate-300"
                >
                  <path
                    d="M3 0L0 3L3 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                Back to overview
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="fixed z-20 top-[6.5rem] bottom-0 right-[max(0px,calc(50%-45rem))] w-[19.5rem] py-10 px-8 overflow-y-auto hidden xl:block">
        <h5 className="text-slate-900 font-semibold mb-4 text-sm leading-6 dark:text-slate-100">
          On this page
        </h5>
        <TOC toc={toc}></TOC>
      </div>
    </div>
  )
}

ReleasePage.getLayout = function getLayout(page: ReactNode) {
  return <DocsLayout>{page}</DocsLayout>
}

interface Iparams extends ParsedUrlQuery {
  slug: string[]
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as Iparams
  const slugString = slug.join('/')
  const { frontMatter, content } = await getOrchestrationReleaseChangelog(
    slugString
  )

  // https://github.com/hashicorp/next-mdx-remote/issues/86
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const mdxSource = await serialize(content, mdxOptions)

  return {
    props: {
      frontMatter,
      mdxSource,
      content,
      slug: slugString,
    },
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  const releases = getAllOrchestrationReleasesChangelogs()

  const paths = releases.map((release) => ({
    params: {
      slug: release.slug.split('/'),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}
