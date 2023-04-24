import { getSetting } from '@utils/foundry/settings'
import { replaceHTMLText } from '@utils/jquery'

export function dnd5ParseChat({ message, $html, isAnonymous, actor }: ThirdPartyChatParseArgs) {
    if (!isAnonymous) return

    if (message.rolls.length && getSetting('criticals')) {
        const critical = game.i18n.localize('DND5E.CriticalHit')
        const powerful = game.i18n.localize('DND5E.PowerfulCritical')
        const regexp = new RegExp(` (\\(([\\w ]*)?(?:${critical}|${powerful})([\\w ]*)?\\))$`, 'igm')
        const $flavor = $html.find('header .flavor-text')
        if (game.user.isGM) replaceHTMLText($flavor, regexp, ' <span class="anonymous-replaced">$1</span>', true)
        replaceHTMLText($flavor, regexp, '', true)
    }
}

export function dnd5InitHook(isGM: boolean) {}
