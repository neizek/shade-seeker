<script lang="ts">
	export let value: string;
	export let label: string;
	export let minLength: number | undefined = undefined;
	export let maxLength: number | undefined = undefined;
	export let hasError: boolean = false;

	$: {
		error,
		hasError = error !== undefined;
	}

	let error: string | undefined = undefined;

	function validate() {
		if (minLength && value.length < minLength) {
			error = `Enter at least ${minLength} characters`;
			return;
		}
		if (maxLength && value.length > maxLength) {
			error = `Your input must be less than ${maxLength} characters`
			return;
		}
		if (!value.match(/^[a-zA-Z0-9]+$/)) {
			error = `Only letters and digits are allowed`;
			return;
		}
		error = undefined;
	}

</script>

<fieldset>
	<legend>{label}</legend>
	<input
		bind:value="{value}"
		on:input={validate}
		maxlength="{maxLength}"
		minlength="{minLength}"
	/>
</fieldset>
{#if error}
	<span class="error text-shadow">{error}</span>
{/if}

<style lang="scss">
	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus input:-webkit-autofill {
		-webkit-text-fill-color: inherit;
		box-shadow: 0 0 0px 1000px transparent inset;
		-webkit-box-shadow: 0 0 0px 1000px transparent inset;
		transition: background-color 5000s ease-in-out 0s;
		background: -webkit-linear-gradient(
			top,
			rgba(255, 255, 255, 0) 0%,
			rgba(0, 174, 255, 0.04) 50%,
			rgba(255, 255, 255, 0) 51%,
			rgba(0, 174, 255, 0.03) 100%
		);
	}

	input {
		font-size: 18px;
		justify-content: center;
		line-height: 1em;
		max-width: 100%;
		width: 100%;
		min-width: 140px;
		padding: 12px 16px;
		text-decoration: none;
		user-select: none;
		-webkit-user-select: none;
		touch-action: manipulation;
		background-color: transparent;
		border: 0;
		overflow: hidden;
	
	  &:focus-visible {
			border-color: white;
			box-shadow: 0;
			outline: 0;
	  }
	  
	}

	fieldset {
		border: 3px solid white;
		border-radius: 8px;

		legend {
			padding: 0 8px;
			margin-left: 8px;
			margin-bottom: -8px;
		}
	}

	.error {
		font-size: 14px;
		margin-top: -8px;
		color: red;
	}
	</style>