module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("bilder");
  eleventyConfig.addPassthroughCopy("data");
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("bilder");
  eleventyConfig.addPassthroughCopy("data");
  eleventyConfig.addPassthroughCopy("admin");
};