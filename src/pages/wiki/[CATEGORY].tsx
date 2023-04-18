import React, { useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import { MARKDOWN_RESOURCES } from "@/lib/CONSTANTS";
import { Loader, Switch } from "@mantine/core";
import {
  H1Renderer,
  H2Renderer,
  H3Renderer,
  H4Renderer,
  LiRenderer,
  LinkRenderer,
  PRenderer,
} from "@/lib/wiki/renderers";
import { useQuery } from "@tanstack/react-query";
import WikiHome from "@/components/wiki/WikiHomePage";

import WikiBottomNavigator from "@/components/wiki/WikiBottomNavigator";
import WikiCategoriesSidebar from "@/components/wiki/WikiCategoriesSidebar";
import WikiContentsSidebar from "@/components/wiki/WikiContentsSidebar";
import { useRouter } from "next/router";

const Wiki = () => {
  const router = useRouter();
  const CATEGORY = router.query.CATEGORY as string;

  const markdownCategory = MARKDOWN_RESOURCES.find(
    (item) => item.urlEnding.toLowerCase() === CATEGORY?.toLowerCase()
  )!;

  useEffect(() => {
    if (CATEGORY && !markdownCategory) {
      router.push("/wiki/home");
    }
  }, [CATEGORY, markdownCategory]);

  return (
    <div className="flex justify-between overflow-hidden h-[calc(100vh_-_6rem)] gap-2">
      <WikiCategoriesSidebar markdownCategory={markdownCategory} />

      {CATEGORY?.toLowerCase() === "home" ? (
        <WikiHome />
      ) : (
        <LinkDataRenderer
          CATEGORY={CATEGORY}
          markdownCategory={markdownCategory}
        />
      )}
    </div>
  );
};

interface LinkDataRendererProps {
  CATEGORY: string;
  markdownCategory: {
    title: string;
    urlEnding: string;
  };
}

const LinkDataRenderer: React.FC<LinkDataRendererProps> = ({
  CATEGORY,
  markdownCategory,
}) => {
  const [starredLinks, setStarredLinks] = useState(false);

  // replace this with maps
  const markdownHeadings = {};

  // const [scrollY, setScrollY] = useState(0);
  // console.log(scrollY);

  // const linksDataRef = useRef(null);

  // const handleScroll = useCallback(() => {
  //   setScrollY(linksDataRef.current.scrollY);
  //   console.log(linksDataRef.current.scrollY);
  // }, []);

  // useEffect(() => {
  //   const currRef = linksDataRef.current;
  //   currRef.addEventListener("scroll", handleScroll, {
  //     passive: true,
  //   });
  //   return () => currRef.removeEventListener("scroll", handleScroll);
  // }, [handleScroll]);

  // const handleScrollUp = () => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  const fetchWikiData = async () => {
    const markdownUrlEnding = markdownCategory?.urlEnding;

    if (!markdownUrlEnding) {
      return;
    }
    const markdownUrl =
      "https://raw.githubusercontent.com/nbats/FMHYedit/main/" +
      markdownUrlEnding +
      ".md";

    const res = await fetch(markdownUrl);
    const text = await res.text();

    const cleanedText = text.split("For mobile users")[1];
    return cleanedText || text;
  };

  const { data, error } = useQuery({
    queryKey: ["wiki", CATEGORY],
    enabled: !!CATEGORY && CATEGORY !== "home",
    queryFn: fetchWikiData,
  });

  useEffect(() => {
    const currentUrl = window.location.href;

    if (!data || !currentUrl.includes("#")) return;

    const id = currentUrl.split("#").at(-1);

    if (!id) return;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  return (
    <>
      <div
        className="flex-1 sm:px-4 md:px-8 lg:px-14 xl:px-20 overflow-scroll"
        // ref={linksDataRef}
      >
        <div className="flex justify-between items-center">
          <p className="text-3xl underline underline-offset-2 font-semibold tracking-tighter">
            {markdownCategory?.title}
          </p>
          <Switch
            className={
              ["beginners-guide", "storage"].includes(CATEGORY) ? "hidden" : ""
            }
            label="Recommended?"
            size="xs"
            checked={starredLinks}
            onChange={(event) => setStarredLinks(event.currentTarget.checked)}
          />
        </div>

        {error ? <p>Something went wrong!</p> : <></>}

        {!error && data && data.length > 0 ? (
          <>
            {/* @ts-ignore */}

            <ReactMarkdown
              components={{
                // @ts-ignore
                h1: (props) => H1Renderer(props, markdownHeadings),
                // @ts-ignore

                h2: (props) => H2Renderer(props, markdownHeadings),
                // @ts-ignore

                h3: (props) => H3Renderer(props, markdownHeadings), //for beginners guide only
                // @ts-ignore

                h4: (props) => H4Renderer(props, markdownHeadings), //for storage only
                // @ts-ignore

                p: PRenderer, // for beginners guide only
                a: LinkRenderer,
                li: (props) => LiRenderer(props, starredLinks), //for storage only
                hr: () => <></>,
              }}
            >
              {data}
            </ReactMarkdown>
            {/* 
            {scrollUp && (
              <div
                onClick={handleScrollUp}
                className="fixed bottom-5 right-5 mr-4 mb-4"
              >
                <BsFillArrowUpCircleFill className="w-8 h-8" />
              </div>
            )} */}
          </>
        ) : (
          <div className="justify-center items-center flex h-[calc(100vh_-_6rem)]">
            <Loader variant="dots" />
          </div>
        )}

        <WikiBottomNavigator CATEGORY={CATEGORY} />
      </div>
      <WikiContentsSidebar
        markdownHeadings={markdownHeadings}
        CATEGORY={CATEGORY}
      />
    </>
  );
};

export default Wiki;