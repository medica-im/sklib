<script lang="ts">
	import * as m from "$msgs";
    import { capitalizeFirstLetter } from '$lib/helpers/stringHelpers';
    import { language } from '$lib/store/languageStore';
    import Fa from 'svelte-fa'
    import { faGlobe, faBlog } from '@fortawesome/free-solid-svg-icons';

    export let website;

    function removeHttp(url) {
        return url.replace(/^https?:\/\//, '');
    } 
</script>

{#if website.type == "Blog"}
<a href="{website.website}" rel="external" class="btn variant-ghost-secondary">
<span><Fa icon={faBlog} /></span><span>Blog</span>
</a>
{:else}
<a
    href="{website.website}"
    title={removeHttp(website.website)}
    target="_blank"
    rel="external"
    class="btn variant-ghost-secondary">
    <span><Fa icon={faGlobe} /></span><span>{capitalizeFirstLetter(m.WEBSITE(), $language)}</span>
    </a>
{/if}