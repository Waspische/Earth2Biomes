<template>
  <div>{{ tweets }}</div>
</template>

<script>
export default {
  name: 'EggHunt',
  data () {
    return {
      tweets: ''
    }
  },
  mounted () {
    this.getTweets()
  },
  methods: {
    async getTweets () {
      const data = await this.$axios.$get('https://api.twitter.com/2/tweets/search/recent?start_time=2021-04-04T00:00:00Z&end_time=2021-04-04T00:30:00Z&tweet.fields=attachments,author_id,created_at&expansions=attachments.media_keys,author_id&media.fields=preview_image_url,url&user.fields=username&query=%23Earth2EggHunt') // todo update back
      this.tweets = JSON.stringify(data)
    }
  }
}
</script>

<style scoped>

</style>
