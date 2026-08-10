module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("bilder");
  eleventyConfig.addPassthroughCopy("data");
  eleventyConfig.addPassthroughCopy("admin");

  // Samla alla artiklar från artiklar/-mappen till en collection
  eleventyConfig.addCollection("artiklar", function (collectionApi) {
    return collectionApi.getFilteredByGlob("artiklar/*.md");
  });
};