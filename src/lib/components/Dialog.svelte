<script lang="ts" context="module">
	import { setContext} from "svelte";
	import { writable, type Writable } from "svelte/store";
	import { fade, scale } from "svelte/transition";

	interface DialogComponent {
		component: ConstructorOfATypedSvelteComponent;
		props?: object;
	}

	interface Dialog {
		title: string;
		content: DialogComponent;
	}

	interface CreatedDialog extends Dialog {
		id: number;
	}

	export type CreateDialog = (data: Dialog) => void;
	export type CloseDialog = (id: number) => void;
</script>

<script lang="ts">
	let backgroundElement: HTMLElement | undefined = undefined;
	let animationDuration: number = 200;
	let count = 0;

	const dialogs: Writable<CreatedDialog[]> = writable([]);

	export const createDialog = (data: Dialog) => {
		const newCount = count + 0;
		if (typeof data.content !== "string") {
			data.content = {
				component: data.content.component,
				props: {
					...data.content.props,
					closeDialog: closeDialog,
					dialogId: newCount,
				},
			};
		}
		dialogs.update((current) => {
			const newArray = [...current, { id: newCount, ...data }];
			count += 1;
			return newArray;
		});
		// $popUpsQuantity++;
	};

	function closeDialog(id: number) {
		dialogs.update((current) => current.filter((dialog) => dialog.id !== id));
		// $popUpsQuantity--;
	}

	function handleBackgroundClick(event: Event, id: number) {
		if (event?.target === backgroundElement) closeDialog(id);
	}

	function handleKeydown() {
		// console.log('keydown')
	}
	
	setContext("createDialog", createDialog);
</script>
{#if Array.isArray($dialogs)}
	{#each $dialogs as dialog, id}
		<div
			class="Background"
			bind:this="{backgroundElement}"
			on:click={(event) => handleBackgroundClick(event, dialog.id)}
			on:keydown={handleKeydown}
			role="dialog"
			tabindex="0"
			transition:fade="{{duration: animationDuration}}"
		>
			<div class="Dialog vertical-flex space-l" transition:scale="{{duration: animationDuration}}">
				<div class="space-between space-l">
					<h2 class="text-center">{dialog.title}</h2>
					<div
						class="vertical-flex"
						on:click={() => closeDialog(dialog.id)}
						role="button"
						on:keydown="{() => {}}"
						tabindex="{0}"
					>
						<img
							src="/close.svg"
							alt="Close icon"
							style="height: 36px"
						/>
					</div>
				</div>
				<svelte:component
					this={dialog.content.component}
					{...dialog.content.props}
				/>
			</div>
		</div>
	{/each}
{/if}
<slot></slot>

<style lang="scss">
	.Background {
		z-index: 99;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		backdrop-filter: blur(16px) saturate(180%);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.Dialog {
		z-index: 100;
		position: fixed;
		width: 90%;
		max-width: 400px;
		margin: 0 auto;
		z-index: 100;
		height: auto;
		background-color: #0000004a;
		backdrop-filter: blur(16px) saturate(180%);
		border-radius: 16px;
		padding: 20px;
		box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
	}
</style>