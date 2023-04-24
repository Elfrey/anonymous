import { getName, playersSeeName } from '@src/api'
import { getSetting } from '@utils/foundry/settings'

const SAVE = /\(dc \d+\)/gim

export function wireParseChat({ message, isAnonymous, $html }: ThirdPartyChatParseArgs) {
    if (game.user.isGM) return

    if (isAnonymous) {
        if (getSetting('rolls')) {
            const $tooltips = $html.find('.dice-tooltip')
            $tooltips.empty()
            $tooltips.css('padding-top', 0)

            if (getSetting('criticals')) {
                $html.find('.dice-total').removeClass('critical fumble')
            }

            const $save = $html.find('.phase-saving-throws .phase-heading')
            $save.text($save.text().replace(SAVE, ''))
        }
    }

    // target

    const $target = $html.find('.phase-attack .token-info .token-name')
    const targetUUID = message.getFlag('wire', 'activation.attack.targetActorUuid') as ItemUUID | undefined
    if ($target.length && targetUUID) {
        try {
            const target = (fromUuidSync(targetUUID) as TokenDocument | null)?.actor
            if (target && !target.hasPlayerOwner && !playersSeeName(target)) {
                $target.text(getName(target))
            }
        } catch (error) {
            console.error(error)
        }
    }

    const $targets = $html.find('.phase-saving-throws .saving-throw-target:has(.target-name)')
    const targetsUUID = message.getFlag('wire', 'activation.targetUuids') as ItemUUID[] | undefined
    if ($targets.length && targetsUUID?.length) {
        try {
            for (const uuid of targetsUUID) {
                const target = (fromUuidSync(uuid) as TokenDocument | null)?.actor
                if (target && !target.hasPlayerOwner && !playersSeeName(target)) {
                    $targets.filter(`[data-actor-id="${uuid}"]`).find('.target-name').text(getName(target))
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
}
