<script lang="ts">
	import { changePlayersName, type Player } from "$lib/stores/firebase.js";
	import { playerId } from "$lib/stores/player.js";
	import Button from "./Button.svelte";
	import Input from "./Input.svelte";

	export let player: Player;
	export let changeName: (newName: string) => void;
	let nickname = player.nickname;
	let isWrong: boolean = false;
	let isLoading: boolean = false;

	export let closeDialog: (id: number) => void;
	export let dialogId: number;

	function handleNicknameChange() {
		if (isWrong) {
			return;
		}

		isLoading = true;

		changePlayersName($playerId, nickname)
		.then(() => {
			changeName(nickname);
			closeDialog(dialogId);
		})
		.finally(() => {
			isLoading = false;
		});
	}
</script>

<Input label="Nickname" bind:value="{nickname}" minLength="{2}" maxLength="{20}" bind:hasError="{isWrong}" />
<Button label="Confirm new nickname" on:click="{handleNicknameChange}" isLoading="{isLoading}" />

