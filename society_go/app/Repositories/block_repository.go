package Repositories

import (
	models "go_society_node/society_go/app/Models"
	"go_society_node/society_go/app/dto"
	"go_society_node/society_go/config"
	"log"

	"gorm.io/gorm"
)

func CreateBlockWithUnits(blockReq dto.BlockRequest, unitReq dto.UnitRequest) error {

	// Start a database transaction.
	// If any error is returned inside this function,
	// GORM will automatically ROLLBACK.
	// If nil is returned, GORM will COMMIT.
	return config.DB.Transaction(func(tx *gorm.DB) error {

		// ---------------------------------------------------
		// STEP 1: Create Block (Parent Record)
		// ---------------------------------------------------

		block := models.Block{
			SocietyID: blockReq.SocietyID, // value coming from request
			Name:      blockReq.Blockname, // block name from form
		}

		// IMPORTANT:
		// We use 'tx' instead of 'config.DB'
		// because 'tx' represents the active transaction.
		// If we use config.DB here, it will NOT be part of transaction.
		if err := tx.Create(&block).Error; err != nil {

			// Returning error here will:
			// ❌ Rollback everything done inside transaction
			return err
		}

		// After successful insert,
		// GORM automatically fills block.ID (Primary Key)
		// So we can use it for child records.
		log.Printf("Block created successfully with ID: %d\n", block.ID)

		// ---------------------------------------------------
		// STEP 2: Create Flat (Child Record)
		// ---------------------------------------------------

		flat := models.Flat{
			BlockID:    block.ID,           // Use generated Block ID
			FlatNumber: unitReq.Flatnumber, // Flat number from request
		}

		if err := tx.Create(&flat).Error; err != nil {

			// If flat insert fails:
			// ❌ Block insert will also be rolled back
			return err
		}

		// ---------------------------------------------------
		// STEP 3: If everything is successful
		// ---------------------------------------------------

		// Returning nil means:
		// ✅ Commit transaction
		// Both Block and Flat will be saved permanently.
		return nil
	})
}
