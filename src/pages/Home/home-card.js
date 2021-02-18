import React from 'react'
import { Card } from '@dhis2/ui'
import { Link } from 'react-router-dom'
import { PropTypes } from '@dhis2/prop-types'

import styles from './HomeCard.module.css'

const HomeCard = ({ titleText, bodyText, linkText, to }) => (
    <Card>
        <div className={styles.container}>
            <h2 className={styles.title}>{titleText}</h2>
            <p className={styles.body}>{bodyText}</p>
            <div className={styles.linkContainer}>
                <Link className={styles.link} to={to}>
                    {linkText}
                </Link>
            </div>
        </div>
    </Card>
)

HomeCard.propTypes = {
    bodyText: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    titleText: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
}

export default HomeCard
