// @ts-check

"use strict";

const {
  checkTagBlankLine,
  checkTagLineBreak,
  findPatternInLines,
} = require("./utils");

/*
 * Check for a single line break between a highlight tag and its content.
 *
 * Exception: There must be a blank line if the highlight content ends in a code
 * block or a numbered list.
 *
 * @param {Object} params Parsed Markdown content, provided by markdownlint.
 * @param {addErrorCallback} onError The callback that adds markdownlint errors.
 */
const checkHighlightLineBreak = (params, onError) => {
  const { lines } = params;
  const openingPattern = "<highlight[^<]*>";
  const closingPattern = "<\\/highlight>";
  const openingTags = findPatternInLines(lines, openingPattern);
  const closingTags = findPatternInLines(lines, closingPattern);

  openingTags.forEach((tag) => {
    checkTagLineBreak({
      tag,
      tagType: "opening",
      pattern: openingPattern,
      errorCallback: onError,
    });
    checkTagBlankLine({
      tag: tag,
      tagType: "opening",
      lines: lines,
      onError: onError,
    });
  });

  closingTags.forEach((tag) => {
    checkTagLineBreak({
      tag,
      tagType: "closing",
      pattern: closingPattern,
      errorCallback: onError,
    });
    checkTagBlankLine({
      tag: tag,
      tagType: "closing",
      lines: lines,
      onError: onError,
      withExceptions: true,
    });
  });
};

module.exports = {
  names: ["TS007", "timescale.highlight-line-break"],
  description:
    "Highlight tags should be separated from their content by a single line break",
  tags: ["validation", "highlights"],
  function: checkHighlightLineBreak,
};
