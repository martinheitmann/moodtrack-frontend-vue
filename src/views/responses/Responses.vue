<template>
    <CCard>
        <CCardHeader>
            Answers
        </CCardHeader>
        <CCardBody>
            <CDataTable
                hover
                striped
                :items="formattedAnswers"
                :fields="fields"
                :items-per-page="5"
                clickable-rows
                :active-page="activePage"
                @row-clicked="rowClicked"
                :pagination="{ doubleArrows: false, align: 'center'}"
                @page-change="pageChange"
            >
            </CDataTable>
        </CCardBody>
    </CCard>
</template>

<script>
import answersQuery from '../../graphql/queries/ANSWERS.gql'
export default {
    name: "Responses",
    data(){
        return {
            answers: [],
            formattedAnswers: [],
            activePage: 1,
            fields: [
                { key: 'user', label: 'User'},
                { key: 'submitted', label: 'Submitted'},
            ],
        }
    },
    watch: {
        answers: function(answers){
            const ret = []
            if(answers && answers.length > 0){
                for(const answer of answers){
                    const newObj = {}
                    const id = answer._id
                    const email = answer.user.email
                    const originalEmail = answer.originalUserData.userId
                    if(email){
                        newObj.user = email
                    }
                    else if(originalEmail) {
                        newObj.user = originalEmail
                    }
                    else newObj.user = "N/A"
                    newObj.submitted = answer.submitted
                    newObj._id = id
                    ret.push(newObj)
                }
                this.formattedAnswers = ret
            }
        }
    },
    methods: {
        rowClicked(){},
        pageChange(){}
    },
    apollo: {
        answers: {
            loadingKey: "loading",
            query: answersQuery
        }
    }
}
</script>